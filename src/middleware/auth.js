import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const auth=(accessRoles=[])=> {
    return async (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        try {
            const decoded = jwt.verify(token, process.env.login_signature);
            const user=await User.findById(decoded.id);

            
            if(accessRoles.includes(user.role)){
                return res.status(403).json({ message: 'Forbidden' });
            }
            
        

        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}