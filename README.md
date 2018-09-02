# Blockchain Ecosystem Explorer

This is an api for recalling blockchain ecosystem details, used by the blockchain ecosystem explorer!

## Repository contents

## back end layout

## API calls

To query groups, send to localhost:4000/grapql
~~~
mutation {
    addGroup(name:"Crypto", sector:"Finance", description:"Internet money") {
      name
      sector
      description
    }
}
~~~

To query groups, together with concept information:
~~~
mutation {
    addGroup(name:"Crypto", sector:"Finance", description:"Internet money") {
      name
      sector
      description
      concepts {
          id
          name
          logo_url
      }
    }
}
~~~

To query all concepts:
~~~
{
    concepts {
        ...required params
    }
}
~~~

To query a specific concept
~~~
{
    concept(id:"97k4908431n41") {
        ...required params
        group {
            id
            name
            sector
            description
        }
    }
}
~~~