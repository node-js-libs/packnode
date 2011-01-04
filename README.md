**packnode minifies, obfuscates and/or encrypts node modules for private use.**

To install packnode, use [npm](http://github.com/isaacs/npm)

    $ npm install pack

## Packing a module
    
To compress and obfuscate `myscript.js` using [uglifyjs](https://github.com/mishoo/UglifyJS), run

    $ cat myscript.js | packnode > packed.js
    
To encrypt `myscript.js` using the password `pass123`, run

    $ cat myscript.js | packnode pass123 > packed.js
    
Encrypted modules can be accessed by calling 

    require(packed_file).unpack(password);
    
## Example

The following example was packed using

    $ packnode pass123 < hello1.js > hello2.js

*hello1.js*

    exports.world = function () {
        console.log('Hello world!');
    };

*hello2.js*

    e="5b3be6d94448754b6d8484a78b5f30d7a2c2598105d0e225166a0132bef8b1cba74422cb32a08289d092e331652e403f4c3239716c3fd1d4605156d9ebb8781e";
    exports.unpack=function(p){var d=require("crypto").createDecipher("aes256",p);eval(d.update(e,"hex","utf8")+d.final("utf8"));return exports}

Both are equivalent

    require('./hello1').world();                    //Outputs 'Hello world!'
    
    require('./hello2').unpack('pass123').world();  //Outputs 'Hello world!'

## Advanced

CoffeeScript modules can be packed using
    
    $ cat myscript.coffee | coffee -c -s | packnode pass123 > packed.js
    
To specify a custom encryption algorithm or output encoding, use `-a` and `-e`

    $ packnode -a aes256 -e hex < myscript.js > packed.js
    
[node.io](http://node.io) has built-in support for unpacking encrypted modules.

To run an encrypted job, use the `-u` switch to specify the password

    $ node.io -u pass123 myjob