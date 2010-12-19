var fs = require('fs'), 
    crypto = require('crypto'),
    child = require('child_process'),
    args = process.argv.slice(2);

var stdin = process.openStdin(), input = '';

var cipher, data = '', encrypted, out, chunk = [],
    packed, decipher,
    encoding = 'base64', 
    algorithm = 'aes256',
    chunk_length = 100,
    password, unpack;

var exit = function (msg, is_error) {
    console.log(msg);
    process.exit(1);
};

var usage = ''
  + '\x1b[1mUsage\x1b[0m: packnode [OPTIONS] [PASSWORD]\n'
  + '\n'
  + '\x1b[1mExample 1\x1b[0m: cat input.js | packnode mypassword > output.js\n'
  + '\x1b[1mExample 2\x1b[0m: cat input.coffee | coffee -c -s | packnode mypassword > output.js\n'
  + '\n'
  + '\x1b[1mOptions\x1b[0m:\n'
  + '  -a, --algorithm <..>   Use the specified algorithm. Default is "aes256"\n'
  + '  -e, --encoding <..>    Encode with base64|hex|binary. Default is "hex"\n'
  + '  -u, --unpack           Unpack the module using the specified password\n'
  + '  -h, --help             Display help information\n'
  ;

var min = function (data, callback) {
    var tmp_file = Math.floor(Math.random() * 1000000) + '.js';
    
    fs.writeFileSync(__dirname + '/' + tmp_file, data, 'utf8');
    
    var remove_tmp = function () { 
        try {
            fs.unlinkSync(__dirname + '/' + tmp_file); 
        } catch (e) {}
    };
    
    ['SIGINT', 'SIGTERM', 'SIGKILL', 'SIGQUIT', 'SIGHUP', 'exit'].forEach(function (signal) {
        process.on(signal, remove_tmp);
    });
    
    child.exec('java -jar yuicompressor-2.4.2.jar "' + tmp_file + '"', {cwd: __dirname}, function (err, stdout, stderr) {
        remove_tmp();
        if (err || stderr) throw err || stderr;
        callback(stdout);
    });
};
  
exports.pack = function () {
  
    if (!args.length) {
        exit(usage);
    }

    while (args.length) {
        arg = args.shift();
        switch (arg) {
        case '-a':
        case '--algorithm':
            algorithm = args.shift();
            break;
        case '-e':
        case '--encoding':
            encoding = args.shift();
            break;
        case '-u':
        case '--unpack':
            unpack = true;
            break;
        case '-h':
        case '--help':
            exit(usage);
            break;
        default:
            password = arg;
            break;
        }
    }

    // Read from stdin
    stdin.setEncoding('utf8');
    stdin.on('data', function (input) { data += input; });
    stdin.on('end', function () { 

        if (!unpack) {

            // Minify the file
            min(data, function (data) {
            
                // Are we just minifying?
                if (!password) {
                    process.stdout.write(data);
                    return;
                }
                
                // Encrypt the file
                cipher = crypto.createCipher(algorithm, password);
                encrypted = cipher.update(data, 'binary', encoding) + cipher.final(encoding); 
                for (var i = 0, l = encrypted.length; i < l; i += chunk_length) {
                    chunk.push(encrypted.substr(i, chunk_length));
                }

                // Prepare the output
                out  = 'e="' + chunk.join('"\n+"') + '";\n';
                out += 'exports.unpack=function(p){var d=require("crypto").createDecipher("' + algorithm + '",p);\n';
                out += 'eval(d.update(e,"' + encoding + '","utf8")+d.final("utf8"));return exports;}';
                
                // ..and write to stdout
                process.stdout.write(out);
        
            });
            
        } else {
            
            // Read and decrypt the file
            packed = (function () { eval(data); return e; }());
            decipher = crypto.createDecipher(algorithm, password);
            out = decipher.update(packed, encoding, 'utf8') + decipher.final('utf8');
            
            process.stdout.write(out);
            
        }
        
    });
}