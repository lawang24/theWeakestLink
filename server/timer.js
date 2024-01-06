class Timer {
    #timeLeft;
    #timer;
    #startingTime;

    constructor(times) {
        this.#timeLeft = [...times]; // W , B 5 minutes default
        this.#startingTime = times[0]
    }

    setTimer(times) {
        this.#timeLeft = [...times];
        this.#startingTime = times[0]
    };

    resetTimer() {
        this.#timeLeft = [this.#startingTime,this.#startingTime]
    }

    getTimer() {
        return this.#timeLeft;
    };

    startTimer(callback, io, roomCode) {
        this.#timer = setInterval(() => {
            // white goes first
            this.#timeLeft[0]--;
            if (this.#timeLeft[0] <= 0) {
                clearInterval(this.#timer);
                callback(io, roomCode);
            }
        }, 1000);
    };

    stopTimer() {
        clearInterval(this.#timer);
    };

    nextTurn(isWhite, callback, io, roomCode) {
        const team = isWhite ? 0 : 1;
        // clearInterval(this.#timer);
        this.#timer = setInterval(() => {
            this.#timeLeft[team]--;
            if (this.#timeLeft[team] <= 0) {
                clearInterval(this.#timer);
                callback(io, roomCode);
            }
        }, 1000);
    };

}

export default Timer;

