`packnode` minifies, obfuscates or encrypts node modules for private use.

To install packnode, use [npm](http://github.com/isaacs/npm)

    $ npm install pack

## Packing a module
    
To compress and obfuscate `myscript.js` using the YUI compressor, run

    $ cat myscript.js | packnode > packed.js
    
To encrypt `myscript.js` using the password `pass123`, run

    $ cat myscript.js | packnode pass123 > packed.js
    
Encrypted modules can be accessed by calling require(packed).unpack(password);
    
## Example

The following example was packed using

    $ packnode pass123 < hello1.js > hello2.js

hello1.js

    exports.world = function () {
        console.log('Hello world!');
    };

hello2.js

    e="Wzvm2URIdUtthISni18w16LCWYEF0OIlFmoBMr74scsw4lLINeJdQOGlVCuAlkEVmrfH2//xsrpRd8bikbPZtQ==";
    exports.unpack=function(p){var d=require("crypto").createDecipher("aes256",p);
    eval(d.update(e,"base64","utf8")+d.final("utf8"));return exports;}

Both are equivalent

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