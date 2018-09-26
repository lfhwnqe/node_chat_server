class Promise {
    constructor(opt) {
        this.status = 'pending'
        this.data = undefined
        this.resolvedCallback = []
        this.rejectedCallback = []
        this.init(opt)
    }

    resolve(value) {
        // TODO
        if (this.status !== 'pending') return
        this.status = 'resolved'
        this.data = value
        this.resolvedCallback.forEach(fn => {
            fn(value)
        })
    }

    reject(reason) {
        // TODO
        if (this.status !== 'pending') return
        this.status = 'rejected'
        this.data = reason
        this.rejectedCallback.forEach(fn => {
            fn(reason)
        })
    }

    init(opt) {
        try {
            opt(this.resolve.bind(this), this.reject.bind(this))
        } catch (e) {
            this.reject(e)
        }
    }

    then(onResolved) {
        return new Promise((resolve, reject) => {
            this.data = 1
            resolve(onResolved(this.data))
        })
    }
}

const foo = new Promise((resolve, reject) => {
    resolve(1)
})