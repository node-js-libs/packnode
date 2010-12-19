`packnode` minifies and encrypts node modules for private use.

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

	packed =  "5b3be6d94448754b6d8484a78b5f30d7a2c2598105d0e225166a0132bef8b1cb30e252c835e25d40";
	packed += "e1a5542b809641159ab7c7dbfff1b2ba5177c6e291b3d9b5";
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