const fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    gltfPipeline = require('gltf-pipeline'),
    crypto = require('crypto'),
    fsExtra = require('fs-extra'),
    gltf_import_export = require("gltf-import-export");

module.exports = {

    // DELETE FILES IN DIRECTORY

    delInDir: (dir) => {
        fs.readdir(dir, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(dir, file), err => {
                    if (err) throw err;
                });
            }
        });
    },

    // FIND IN DIRECTORY

    findInDir: (startPath,filter,res = []) => {
        //console.log('Starting from dir '+startPath+'/');
        if (!fs.existsSync(startPath)) {
            console.log(chalk.redBright("|ERR| Folder doesn't exist -> ",startPath));
            return;
        }
    
        var files=fs.readdirSync(startPath);
        for(var i=0;i<files.length;i++){
            var filename=path.join(startPath,files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()){
                module.exports.findInDir(filename,filter,res); //recurse
            }
            else if (filename.indexOf(filter)>=0) {
                res.push({
                    "title": path.parse(path.basename(filename)).name, 
                    "path": filename, 
                    "size": fs.statSync(filename).size, 
                    "local": path.relative(process.cwd(), filename), 
                    "filename": path.basename(filename),
                    "ext": path.parse(path.basename(filename)).ext.substring(1)
                })
                console.log(chalk.blueBright('|FILE FOUND|',path.relative(process.cwd(), filename)));
            };
        };
        return res;
    },

    // CREATE ARRAY OF MODELS

    arrayOfModels: (conf) => {
        var res = [];
        conf.ext.forEach(extension => {
            Array.prototype.push.apply(res, module.exports.findInDir(__dirname + "/.."+conf.folders.models, extension));
        });
        return res;
    },

    // UPDATE EDITS IN MODELS FOLDER

    updateModels: (conf, input, models = []) => {
        switch (input.event) {
            case "add":
                let file = path.basename(input.path);

                models.push({
                    "title": path.parse(file).name,
                    "path": process.cwd() + "/" + input.path,
                    "size": fs.statSync(process.cwd() + "/" + input.path).size, 
                    "local": input.path,
                    "filename": file,
                    "ext": path.parse(file).ext.substring(1)
                });
                break;
            case "change":
                
                break;
            case "unlink":
                
                break;
        }
        console.log(input);
        return models;
    }
}
