export default class Room {
    constructor(name, owner, questions = 1, users = []) {
        this.name = name;
        this.owner = owner;
        this.points = {};
        this.options = [];
        this.answers_by_player = {};
        users.forEach((u) => {
            this.points[u] = 0;
        });

        this.started = false;
        this.finished = false;
        this.questions_remaining = questions;
        this.current_question = "";
        this.answer = "";
        this.winner = "";
        this.debug = true;
    }

    start(question, options, answer) {
        this.current_question = question;
        this.answer = answer;
        this.options = options;
        this.started = true;
        this.log(`Started: ${this.name} with owner ${this.owner}`);
        console.log(`Current question: ${this.current_question}`);

    }

    log(...messages) {
        if (!this.debug) return;
        console.log("---------------------------------")
        console.info(`From ${this.name} >\n`, messages);
    }

    join(user_name) {
        this.points[user_name] = 0;
        this.log(`Joined: ${user_name}`);
    }

    kick(user_name) {
        delete this.points[user_name];
        if (user_name === this.owner) this.finished = true;
        this.log(`Kicked: ${user_name}`);
    }



    all_answered() {
        return Object.keys(this.points).every(
            (user) => user in this.answers_by_player
        );
    }

    next_question(question, options, answer) {
        if (!this.all_answered()) {
            this.log(`All users need to answer to continue`);
            return false;
        }

        this.current_question = question;
        this.answer = answer;

        this.questions_remaining--;
        this.answers_by_player = {};

        if (this.questions_remaining === 0) {
            this.finished = true;
            this.log(`Finished game`);
        }

        this.log(`Questions remaining: ${this.questions_remaining}`);
        return true;
    }

    calc_winner() {
        let maxScore = -Infinity;
        let winner = null;

        for (const [name, score] of Object.entries(this.points)) {
            if (score > maxScore) {
                maxScore = score;
                winner = name;
            }
        }
        this.winner = winner;
        return winner;
    }

    user_has_answered(user_name) {
        return user_name in this.answers_by_player;
    }

    user_answer(user_name, user_answer) {
        this.log(`Answer: ${user_answer}`);
        this.answers_by_player[user_name] = user_answer;
        if (user_answer === this.answer) {
            this.points[user_name] = (this.points[user_name] || 0) + 1;

            this.calc_winner();

            this.log(`Correct answer`);
            this.log(`Leader list: ${this.points}`);
            return true;
        }
        return false;
    }

    close(user_name) {
        const a = user_name === this.owner;
        if (a) {
            this.finished = true
            this.log(`Closed the game: ${this.owner}, room: ${this.name}`);
        };

        return a;
    }
}
