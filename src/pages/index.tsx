import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { StatsTable } from 'src/components/Table'

export default function Home() {
  const router = useRouter()

  const searchPlayer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = event.currentTarget.search.value
    router.push(`/players/${query}`);
  }

  const type: any = null;
  const [data, setData] = useState(type);
  const [isLoading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutID = setTimeout(() => controller.abort(), 10000)

    fetch(`/api/stats`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
            setData(data)
            setLoading(false)
        }).catch((e) => {
          if (controller.signal.aborted && !data)  { 
            setIsError(true)
            setLoading(false)
          }
        })
  }, [])

  return (
    <>
      <Head>
        <title>Lịch sử vi phạm | MineVN Network</title>
        <meta name="description" content="Trang web tra cứu lịch sử vi phạm tại MineVN" />
      </Head>
      <div className="content">
        <div className="centered">
          <div className="card center" style={{maxWidth: '500px', marginTop: '100px'}}>
            <div className="card-body">
              <div style={{marginBottom: '16px'}}>
                <h3 style={{fontFamily: 'Minecraft', marginBottom: '0px'}}>MineVN</h3>
                <h5 className="text-muted mb-2" style={{marginTop: '0px'}}>Lịch sử vi phạm</h5>
              </div>
              <div style={{marginBottom: '16px'}}>
                <form onSubmit={searchPlayer}>
                  <div className="input-group centered" style={{maxWidth: '400px'}}>
                    <input className="form-control" type="text" style={{borderWidth: '0px'}} name="search" placeholder="Tìm kiếm người chơi..." autoComplete="off" autoFocus inputMode="text" />
                    <button className="btn btn-primary" type="submit"><i className="fas fa-search" /></button>
                  </div>
                </form>
              </div>
              <div>
                <h6 className="text-muted">Thống kê sơ bộ:</h6>
                { isLoading ? <span className="loader"></span> : isError ? <p className="text-muted">Unable to fetch data.</p> :<StatsTable data={data.data} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
