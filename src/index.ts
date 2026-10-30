import 'reflect-metadata';
import express, { Request, Response} from 'express';
import { AppDataSource} from "./db/data-source";
import {User} from "./entities/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Product} from "./entities/Product";
import {authenticateToken} from "./middlewares/auth";
import {Order} from "./entities/Order";

const app = express();
app.use(express.json());

const PORT = 3000;

const JWT_SECRET = 'super_dan_it_secret'; // process.env.JWT_SECRET

AppDataSource.initialize()
.then(() => {
    console.log('Database successfully connected');

    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);
    const orderRepository = AppDataSource.getRepository(Order);


    app.post('/register', async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // VALIDATION NEEDED

            // SELECT * FROM users WHERE email = email;
            const existingUser = await userRepository.findOneBy({ email });

            if (existingUser)
                return res.status(400).json({message: "user_already_exists"});

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = userRepository.create({
                email,
                password: hashedPassword,
            });

            await userRepository.save(newUser); // INSERT INTO users ...

            res.status(201).json({message: "successfully_registered"});
        } catch (e) {
            console.error(e);
            res.status(500).json({error: "internal_server_error"});
        }
    });

    app.post('/login', async (req: Request, res: Response) => {
        try {
           const { email, password } = req.body;

           // VALIDATION NEEDED

           const user = await userRepository.findOneBy({ email });

           if (!user)
               return res.status(400).json({message: "invalid_password_or_email"});

           const isMatch = await bcrypt.compare(password, user.password);

           if (!isMatch)
               return res.status(400).json({message: "invalid_password_or_email"});

           const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '2h'});
           res.json({ message: "successfully_logged_in", token });

        } catch (e) {
            console.error(e);
            res.status(500).json({error: "internal_server_error"});
        }
    });

    app.post('/products', async (req: Request, res: Response) => {
        try {
            const { name, price, stock } = req.body;

            // VALIDATION NEEDED

            const newProduct = productRepository.create({name, price, stock}); // just creating instance of Product class
            await productRepository.save(newProduct); // INSERT INTO products...

            res.status(201).json({product: newProduct});
        } catch (e) {
            console.error(e);
            res.status(500).json({error: "internal_server_error"});
        }
    });

    app.get('/products', async (req: Request, res: Response) => {
        // SELECT * FROM products;
        const products = await productRepository.find();
        res.json(products);
    });

    app.post('/orders', authenticateToken, async (req: Request, res: Response) => {
        try {
            const {productId, quantity} = req.body;

            const userId = req.userId!;

            // VALIDATION NEEDED

            const product = await productRepository.findOneBy({ id: productId });

            if (!product)
                return res.status(404).json({message: "product_not_found"});

            if (product.stock < quantity)
                return res.status(400).json({message: "quantity_is_too_many"});

            product.stock -= quantity;
            await productRepository.save(product);

            const user = await userRepository.findOneBy({ id: userId });

            if (!user)
                return res.status(404).json({message: "user_not_found"});

            const newOrder = orderRepository.create({
                quantity, user, product
            });

            await orderRepository.save(newOrder);

            res.status(201).json({orderId: newOrder.id});

        } catch (e) {
            console.error(e);
            res.status(500).json({error: "internal_server_error"});
        }
    })

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('Error while connecting to database', err);
});

// START TRANSACTION;

// DELETE FROM employees ...
// INSERT INTO employees ...

// COMMIT;

// ROLLBACK;

