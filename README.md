Packnode encrypts node modules for private use

To install packnode, use [npm](http://github.com/isaacs/npm)

    $ npm install pack

## Packing a module
    
To pack a module using a password (e.g. `pass123`), run

    $ cat myscript.js | packnode pass123 > packed.js
    
CoffeeScript modules can be packed using
    
    $ cat myscript.coffee | coffee -c -s | packnode pass123 > packed.js
    
To specify a custom encryption algorithm or output encoding, use `-a` and `-e`

    $ packnode -a aes256 -e hex < myscript.js > packed.js

## Using a packed module

Encrypted modules can be accessed by calling `unpack(password)`

    require('./packed').unpack('pass123'); //Same as require('./myscript')
    
## Example

The following example was packed using

    $ packnode pass123 < hello1.js > hello2.js

hello1.js

    exports.world = function () {
        console.log('Hello world!');
    };

hello2.js

    var crypto = require("crypto");
    packed = "fec9063967f14579d132aafe31e1747df6a33318a847e7d8720821294c3ecb0791bcbabd58231b35";
    packed += "719efa39799269f5d7af18fee4b1c5e06d3291b099f90134481942ece7acd931f09c0ea34aaafcc1";
    exports.unpack = function (password) {
        var decipher = crypto.createDecipher("aes256", password);
        exports = (function (exports, packed) {
            var unpacked = decipher.update(packed, "hex", "utf8") + decipher.final("utf8");
            eval(unpacked); return exports;
        }(exports, packed));
        return exports;
    };

Running both modules

    require('./hello1').world();                    //Outputs 'Hello world!'
    require('./hello2').unpack('pass123').world();  //Outputs 'Hello world!'
