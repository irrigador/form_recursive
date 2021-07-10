import  {Knex}  from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('class_schedule', table  => {
        table.increments('id').primary();

        table.string('week_day').notNullable();
        table.string('from').notNullable();
        table.string('to').notNullable();

    });
}

export async function down(knex: Knex ) {
    return knex.schema.dropTable('class_schedule');
    
}