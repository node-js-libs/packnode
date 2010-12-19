`packnode` encrypts node modules for private use.

To install packnode, use [npm](http://github.com/isaacs/npm)

    $ npm install pack

## Packing a module
    
To pack a module using a password (e.g. `pass123`), run

    $ cat myscript.js | packnode pass123 > packed.js
    
Encrypted modules can be accessed by calling `require(module).unpack(password)`

    require('./packed').unpack('pass123'); //Same as require('./myscript')
    
## Example

The following example was packed using

    $ packnode pass123 < hello1.js > hello2.js

hello1.js

    exports.world = function () {
        console.log('Hello world!');
    };

hello2.js

    packed =  "fec9063967f14579d132aafe31e1747dea6aeea1d396db60f9eb48d1d424e5bfcb32a74454346166";
	packed += "55132c4d04a6b37b59e1a3d4857ad56fa3f242200b8b27272a5d4f6460fcce96b5a9290df4df9bcf";
	exports.unpack = function (password) {
		var decipher = require("crypto").createDecipher("aes256", password);
		eval(decipher.update(packed, "hex", "utf8") + decipher.final("utf8"));
		return exports;
	};

Running both modules

    require('./hello1').world();                    //Outputs 'Hello world!'
    require('./hello2').unpack('pass123').world();  //Outputs 'Hello world!'

## Advanced

CoffeeScript modules can be packed using
    
    $ cat myscript.coffee | coffee -c -s | packnode pass123 > packed.js
    
To specify a custom encryption algorithm or output encoding, use `-a` and `-e`

    $ packnode -a aes256 -e hex < myscript.js > packed.js
    
[node.io](http://node.io) has built-in support for unpacking private modules.

To run a packed job, use the `-u` switch to specify the password

    $ node.io -u pass123 myjob