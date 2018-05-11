const flags = [ 'i' ];

class FlagStore {
    constructor(flags){
        if(typeof flags !== "object" && !flags.length) throw new ReferenceError("flags has to be an array");
        this._flags = flags;
    }

    static fromString(string){
        string.match(new RegExp("-flag:(" + flags.join("|") + ")(,(" + flags.join("|") + "))* *$"));
    }

    get flags(){
        return this._flags;
    }

    set flags(value){
        if(typeof value !== "object" && !value.length) throw new ReferenceError("flags has to be an array");
        this._flags = value;
    }
}

module.exports = FlagStore;
