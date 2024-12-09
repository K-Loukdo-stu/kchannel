import * as crypto from 'crypto';



export const encryptWithCipher = (text, secret) => {
    return new Promise((resolve, reject) => {

        const algorithm = 'aes-192-cbc';

        // Defining key
        const key = crypto.scryptSync(secret, 'ttt', 24);

        // Defininf iv
        const iv = Buffer.alloc(16, 0);

        // Creating cipher
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        // Declaring encrypted
        let encrypted = '';

        // Reading data
        cipher.on('readable', () => {
            let chunk: any;
            while (null !== (chunk = cipher.read())) {
                encrypted += chunk.toString('base64');
            }
        });

        // Handling end event
        cipher.on('end', () => {
            resolve(encrypted)
        });

        // Writing data
        cipher.write(text);
        cipher.end();
    })
}


export const decryptWithCipher = (encryptedText, secret) => {
    return new Promise((resolve, reject) => {

        const algorithm = 'aes-192-cbc';

        const key = crypto.scryptSync(secret, 'ttt', 24);

        // Defininf iv
        const iv = Buffer.alloc(16, 0);

        // Creating decipher
        const decipher =
            crypto.createDecipheriv(algorithm, key, iv);

        // Declaring decrypted
        let decrypted = '';

        // Reading data
        decipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        });

        // Handling end event
        decipher.on('end', () => {
            resolve(decrypted)
        });

        decipher.on('error', (err) => {
            reject(err);
        })

        decipher.write(encryptedText, 'base64');
        decipher.end();
    })
}

