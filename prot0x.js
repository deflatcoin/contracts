function connect0x() {
  		    zeroExInstant.render(
										{
												orderSource: 'https://api.radarrelay.com/0x/v2/',
												additionalAssetMetaDataMap: {                                                
												'0xf47261b0000000000000000000000000e1e0db951844e7fb727574d7daca68d1c5d1525b': {
                                                assetProxyId: '0xf47261b0', 
                                                decimals: 18,
                                                symbol: 'DEFT',
                                                name: 'DEFLAT Coin',
                                                primaryColor: '#000000', 
                                                iconUrl: 'https://deflatcoin.github.io/img/deflat-logo-vetor.svg', 
                                                },
                                            },  
											    affiliateInfo: {
                                                feeRecipient: '0x4d717d48BB24Af867B5efC91b282264Aae83cFa6',
                                                feePercentage: 0.01,
                                            },
											availableAssetDatas: ['0xf47261b0000000000000000000000000e1e0db951844e7fb727574d7daca68d1c5d1525b'],
                                            defaultSelectedAssetData: '0xf47261b0000000000000000000000000e1e0db951844e7fb727574d7daca68d1c5d1525b',
                                        },											
							            'body',								
							    );
						}
	
