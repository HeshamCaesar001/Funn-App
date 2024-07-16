import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {randomBytes, scrypt as _scrypt} from "crypto";
import {promisify} from "util";
import { User } from './user.entity';
import { Repository } from 'typeorm';


const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private repo:Repository<User>){}

    /**
   * Creates a new user.
   * 
   * @param {name,password,email,city} userData - The user data to create.
   * @returns {Promise<User>} - The created user.
   * @throws {Error} - if the user already exists with that email
   */

    async create(name: string, password: string, email: string,city: string): Promise<User>{
    
        const existUser = await this.repo.findOneBy({email});
        if(existUser){
            throw new BadRequestException("User already exists");
        }
        // hash user password
        // generate salt
        const salt = randomBytes(8).toString('hex');
        //hash the salt and the pass together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // Join  the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');
        //create new user and save it
        const user =  this.repo.create({email, password:result,name,city});
        // return saved user;
       return this.repo.save(user);
      

    }

     /**
   * Finds a user by their ID.
   * 
   * @param {number} id - The ID of the user to find.
   * @returns {Promise<User>} - The found user, or null if no user is found.
   */
    findUser(id:number):Promise<User>{
        if(!id){
            return null;
        }
        return this.repo.findOneBy({id})
    }
}
