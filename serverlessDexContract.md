# Tables

<b>Orders:</b>

<pre>
    struct order {
      uint orderId;
      address orderOwner;
      uint rate;
      uint amount;
      bool sell; 
      uint date;
    } 
</pre>

<b>Orders Done: </b>

<pre>
    struct done {
      uint orderId;
      address fillOwner;
      uint fillAmount;
      uint fillDate;
      uint rate;   
    }
</pre>

<b>Markets:</b>

<pre>
    struct market {  
      bool exists;
      address tokenPair;
      uint ordersCount;
      uint donesCount;
      mapping(uint => order) orders; 
      mapping(uint => done) dones;
    }
</pŕe>

<b>Vote Status:</b>

<pre>
    struct voted {
      bool like;
      bool dislike;
    }
</pre>

<b>Token Data:</b>

<pré>
    struct token {
      address tokenBase;
      string name;
      string symbol;
      uint decimals;
      uint likesCount;
      uint dislikesCount; 
      uint marketsCount;
      mapping(uint => address) marketIndex; 
      mapping(address => market) markets;
      mapping(address => voted) voteStatus;
    }
	</pre>
  
  <b>Primary Mapps:</b>
  
  <pre>
    mapping(uint => address) public index;
    mapping(address => token) public tokens;
    mapping(address => bool) public exists;	
  </pre>
