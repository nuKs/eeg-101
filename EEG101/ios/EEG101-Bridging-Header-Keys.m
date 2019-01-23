// Passes FLUX_IOS_ENCRYPTIONKEY as generated by .env in root folder to swift.

#import <Foundation/Foundation.h>

#define QUOTE(name) #name
#define STR(macro) QUOTE(macro)

#ifndef FLUX_IOS_ENCRYPTIONKEY
#error "FLUX_IOS_ENCRYPTIONKEY preprocessor macro must be defined"
#else
#define FLUX_IOS_ENCRYPTIONKEY_VALUE STR(FLUX_IOS_ENCRYPTIONKEY)
#endif

NSString* const kFluxIosEncryptionKey = @""FLUX_IOS_ENCRYPTIONKEY_VALUE;
