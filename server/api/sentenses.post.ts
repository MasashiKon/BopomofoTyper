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

      const res2 = await axios.post(
        dbUrl,
        {
          query: generateQuery(level, 2)
        },
        {
          headers: {
            apikey: dbApikey
          }
        }
      )      
    
    return {
      notch1: res1.data.data,
      notch2: res2.data.data
    }
  })