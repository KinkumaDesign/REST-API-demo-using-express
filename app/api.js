var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

var jsonFilePath = 'data/todos.json';

var defaultJSON = {
    "todos":[]
};

var Todo = function(){
    this.id = guid();
    this.text = "";
    this.complete = false;
};

function checkJSONExists(){
    return new Promise(function(resolve){
        fs.stat(jsonFilePath, function(err, stats){
            if(err){
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}

function readJSON(){
    return new Promise(function(resolve){
        fs.readFile(jsonFilePath, function(err, data){
            if(err){
                resolve(defaultJSON);
                console.error('not found');
                return;
            }
            resolve(JSON.parse(data));
        });
    });
}

function writeJSON(json){
    return new Promise(function(resolve, reject){
        fs.writeFile(jsonFilePath, JSON.stringify(json), function(err){
            if(err){
                console.error(err);
                reject(err);
                return;
            }
            resolve(json);
        })
    });
}

function getTodoList(){
    return new Promise(function(resolve){
        checkJSONExists().then(function(exists){
            if(exists){
                return readJSON();
            }else{
                resolve(defaultJSON);
            }
        }).then(function(json){
            resolve(json);
        });
    });
}

function getTodo(id){
    return new Promise(function(resolve){
        if(!id){
            resolve(null);
            return;
        }
        checkJSONExists().then(function(exists){
            if(exists){
                return readJSON();
            }else{
                resolve(null);
            }
        }).then(function(json){
            var todos = json.todos;
            if(!todos){
                resolve(null);
                return;
            }
            for(var i = 0, len = todos.length; i < len; i++){
                var todo = todos[i];
                if(todo.id == id){
                    resolve(todo);
                    return;
                }
            }
            resolve(null);
        });
    });
}

function sendBadStatusResponse(res, status){
    res.status(status).send({ msg:'Bad Request'});
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function onRouteGetTodo(req, res){
    getTodo(req.params.id).then(function(obj){
        var result = obj;
        if(result == null){
            result = {};
        }
        res.json(result);
    });
}

function onRoutePutTodo(req, res){
    var body = req.body;
    if(!body.text || body.text.length <= 0){
        sendBadStatusResponse(res, 400);
        return;
    }
    if(!(body.hasOwnProperty("complete")) ||
        !(body.complete == "true" || body.complete == "false")){
        sendBadStatusResponse(res, 400);
        return;
    }

    getTodoList().then(function(json){
        var todos = json.todos;
        for(var i = 0, len = todos.length; i < len; i++){
            var todo = todos[i];
            if(todo.id == req.params.id){
                todo.text = body.text;
                todo.complete = body.complete == "true";
            }
            todos[i] = todo;
        }
        json.todos = todos;
        writeJSON(json).then(function(){
            res.json(json);
        });
    })
}

function onRouteDeleteTodo(req, res){
    getTodoList().then(function(json){
        var todos = json.todos;
        for(var i = 0, len = todos.length; i < len; i++){
            var todo = todos[i];
            if(todo.id == req.params.id){
                todos.splice(i, 1);
                break;
            }
        }
        json.todos = todos;
        writeJSON(json).then(function(){
            res.json(json);
        });
    })
}

app.route('/todos/:id')
    .get(function(req, res){
        onRouteGetTodo(req, res);
    })
    .put(function(req, res){
        onRoutePutTodo(req, res);
    })
    .delete(function(req, res){
        onRouteDeleteTodo(req, res);
    });

app.get('/todos', function(req, res){
    //console.log(req.params);
    getTodoList().then(function(obj){
        res.json(obj);
    })
});

app.post('/todos', function(req, res){
    var body = req.body;
    console.log(body);
    var todo = new Todo();
    if(body.text || body.text.length > 0){
        todo.text = body.text;
    }else{
        sendBadStatusResponse(res, 400);
        return;
    }
    if(body.hasOwnProperty("complete") &&
       (body.complete == "true" || body.complete == "false")){
        todo.complete = body.complete == "true";
    }else{
        sendBadStatusResponse(res, 400);
        return;
    }
    getTodoList().then(function(json){
        json.todos.push(todo);
        return writeJSON(json);
    }).then(function(json){
        res.json(json);
    });
});

app.listen(3001, function(){
    console.log('Example app listening on port 3001');
});
