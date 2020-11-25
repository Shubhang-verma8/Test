const db = require('../dbConfig');

module.exports = {
    add,
    findByemail,
    findByid,
    additems,
    getallitems,
    finditemByid
}


async function add(lesson) {
    return await db('users').insert(lesson, ['first_name']);
    // const [id] = await db('lessons').insert(lesson);
    // return id;
}

async function additems(items) {
    return await db('items').insert(items, ['product_name']);
    // const [id] = await db('lessons').insert(lesson);
    // return id;
}

function getallitems(){
    return db('items');
}

function findByemail(email) {
    return db('users').where({email: email}).first();
}

function findByid(id) {
    return db('users').where({id: id}).first();
}

function finditemByid(id){
    return db('items').where({product_id : id}).first();
}