class Logger {
    constructor() {
        this.levels = {
            'error': 1,
            'warn': 2,
            'default': 3,
            'info': 4,
            'debug': 5
        };
        this.currentLevel = this.levels.default;
        this.log = this.log.bind(this);
    }

    log(msg) {
        if (this.currentLevel <= this.levels.default) {
            console.log(msg);
        }
    }

    info(msg) {
        if (this.currentLevel <= this.levels.info) {
            console.info(msg);
        }
    }

    debug(msg) {
        if (this.currentLevel <= this.levels.debug) {
            console.debug(msg);
        }
    }

    warn(msg) {
        if (this.currentLevel <= this.levels.warn) {
            console.warn(msg);
        }
    }

    error(msg) {
        if (this.currentLevel <= this.levels.error) {}
    }
}

export {Logger};