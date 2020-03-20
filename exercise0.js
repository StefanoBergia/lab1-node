"use strict";

// here goes the code

const stringhe =["ciaoooooo", "come", "va", "io", "tutto", "bene"];

for (let [i,s] of stringhe.entries()){
    if(s.length>=4)
        stringhe[i]=''+s.charAt(0)+s.charAt(1)+s.charAt(s.length-2)+s.charAt(s.length-1);
    else
        stringhe[i]='';
}
console.log(stringhe);