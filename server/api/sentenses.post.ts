import { createClient } from '@supabase/supabase-js'
import axios, { type AxiosResponse } from 'axios'
import generateQuery from '~/src/utils/generateQuery'
import { Level } from '~/types/enums'

export default defineEventHandler(async (event) => {
    const { dbUrl, urlGen, dbApikey, dbUrlGen } = useRuntimeConfig(event)
    const {level} = await readBody(event)    

      const res1 = await axios.post(
        dbUrl,
        {
          query: generateQuery(level, 1)
        },
        {
          headers: {
            apikey: dbApikey
          }
        }
      )
      
      console.log(res1);
      
    
    return {
      hello: res1.data.data
    }
  })