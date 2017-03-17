# NodeJsParallelCalculation
framework for parallel calculation on nodeJs
## Install
1. git clone
2. npm install
3. gulp compile
4. node ./build/main.js
### TODO:
1. add shared memory functionality
2. start vm in each child process?
3. allow workers to be on separate machine (this conflicts with the shared memory)
4. make worker blocks for workers who are on the same machine with shared memory
