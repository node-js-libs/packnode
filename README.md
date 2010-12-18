Packnode encrypts node modules for private use

## Installation

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