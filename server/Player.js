// this object holds the rating, position, and scorecard for each player
export class Player {

    constructor() {
        this._move_rating = "";
        this._move_fen = "";
        this._scorecard = 0;
        this._target_square = "";
        this._source_square = "";
    }

    get move_rating() {
        return this._move_rating;
    }

    set move_rating(value) {
        this._move_rating = value;
    }

    get move_fen() {
        return this._move_fen;
    }

    set move_fen(value) {
        this._move_fen = value;
    }

    get scorecard() {
        return this._scorecard;
    }

    set scorecard(value) {
        this._scorecard = value;
    }
}
