import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super_dan_it_secret'; // process.env.JWT_SECRET

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // Bearer + " " + token

    const authToken = authHeader && authHeader.split(" ")[1];

    if (!authToken)
        return res.status(401).json({message: "invalid_token"});

    jwt.verify(authToken, JWT_SECRET, (err, decoded: any) => {
        if (err)
            return res.status(403).json({message: "expired_token"});

        req.userId = decoded.userId;
        next();
    })
}

