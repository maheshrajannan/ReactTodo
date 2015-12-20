echo "Cleaning ${PWD##*/}" 
rm -fr node_modules/*
echo 'Now installing'
npm install
node server
