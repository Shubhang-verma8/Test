
exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.timestamps(true, true);
    })
    .createTable('items', table => {
        table.increments('product_id').primary();
        table.string('category').notNullable();
        table.string('product_name').notNullable();
        table.integer('product_price').notNullable();
        table.string('product_image').notNullable();
        table.integer('quantity').notNullable(); 
    })
    

};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users').dropTableIfExists('items');
};
