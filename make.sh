mv stage stage2
node bin/build.js build
mv stage spl2modules
mv stage2 stage
chmod -R u=rwX,go= spl2modules/*
chmod -R u-x+X spl2modules/*
chmod -R u=rwx,go= spl2modules/bin/*
rm $1
tar -cpzf $1 --exclude=spl2modules/.* --exclude=spl2modules/local spl2modules
rm -rf spl2modules