 class Timer {
    #timeLeft;
    #timer;

    constructor(times) {
        this.#timeLeft = [...times]; // W , B 5 minutes default
    }

    setTimer(times) {
        this.#timeLeft = [...times];
    };

    getTimer() {
        return this.#timeLeft;
    };

    startTimer(callback) {
        this.#timer = setInterval(() => {
            // white goes first
            this.#timeLeft[0]--;
            if (this.#timeLeft[0]<=0) {
                clearInterval(this.#timer);
                callback();
            }
        }, 1000);
    };

    stopTimer(){
        clearInterval(this.#timer);
    };

    nextTurn(isWhite,callback,io,roomCode) {
        const team = isWhite? 0 : 1;
        clearInterval(this.#timer);
        this.#timer = setInterval(() => {
            this.#timeLeft[team]--;
            if (this.#timeLeft[team]<=0) {
                clearInterval(this.#timer);
                callback(io,roomCode);
            }
        }, 1000);
    };

}

export default Timer;

