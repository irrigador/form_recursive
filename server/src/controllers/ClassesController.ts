import {  Request, Response  } from 'express';
import db from '../database/connection';

export default class ClassesController{
    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        
        if (!filters.subject) {
            return response.status(400).json ({
                error: 'Falta adicionar algo'
            });
        }
        
        const classes = await db ('classes')
            .where('classes.subject',  '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

            return response.json(classes);
    }
    
    async create (request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            week_day,
            from,
            to
        } = request.body;
    
        const trx = await db.transaction();
    
    
        try {
        const instertUsersIds = await trx ('users').insert({
            name,
            avatar,
            whatsapp,
            bio,
        });
    
        const user_id = instertUsersIds [0];
    
       const insertedClassesIds = await trx ('classes').insert ({
           subject,
           cost,
           user_id,
       });

       await trx ('class_schedule').insert ({
            week_day,
            from,
            to
       });
    
        await trx.commit(); 
       
       return response.status(201).send();
    } catch (err) {
        await trx.rollback();

        return response.status(400).json ({
            error: 'Erro na criação de alguma classe'
        })
      }    
    }
}