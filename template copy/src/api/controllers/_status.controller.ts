import * as express from 'express'

const _statusController = {
    getStatus(req: express.Request, res: express.Response) {
        res.sendStatus(200)
    }
}

export default _statusController
