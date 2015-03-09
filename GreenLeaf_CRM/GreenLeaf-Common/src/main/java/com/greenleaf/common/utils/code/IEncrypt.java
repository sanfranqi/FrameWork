package com.greenleaf.common.utils.code;


import com.greenleaf.common.exception.DecryptException;

public interface IEncrypt {
    

    String encrypt(String str);
    

    String decrypt(String enStr) throws DecryptException;
}
