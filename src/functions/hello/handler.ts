import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';


import axios from 'axios';


const hello: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {

  const { data, status } = await axios.get<any>(
    'https://www.mnb.hu/arfolyamok',
    {
      headers: {
        'User-Agent': 'curl/7.47.0',
        Accept: '*.*',
      },
    },
  );

  if (status == 200) {
    let regex = /<td class="fw-b">([A-Z]{3})[^\n]*\n[^\n]*\n[^\n]*\n\s*<td>([0-9,]*)/gm
    let result;
    let resultObject = {};
  
    while ((result = regex.exec(data)) !== null) {
      resultObject[result[1]] = result[2];
    }
  
    return formatJSONResponse(
      resultObject
    );
  } else {
    console.log(status)
    return {
      statusCode: 500,
      body: "Internal Error"
    }
  }  
};

export const main = middyfy(hello);
