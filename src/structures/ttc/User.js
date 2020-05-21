module.exports = class User {
    constructor(data) {
        this.id = data.userid;
        this.notificationChannel = data.notificationChannel;
        this.baseRating = data.base_rating;
        this.totalRating = data.total_rating;
        this.pid = data.pid;
        this.ghost = data.ghost;
        this.tier = data.tier;
    }

    get rating() {
        return this.baseRating + this.totalRating;
    }
}