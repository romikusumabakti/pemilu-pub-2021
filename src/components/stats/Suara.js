import { Card, CardContent, CardHeader, colors, Grow } from "@material-ui/core";
import { useEffect, useState } from "react";
import { RadialChart } from 'react-vis';
import { API_URL } from "../../App";

export default function Suara(props) {
    const [daftarkandidat, setDaftarKandidat] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetch(API_URL + '/pemilu/kandidat/')
            .then(response => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json();
            })
            .then(daftarKandidat => {
                setDaftarKandidat(daftarKandidat);
                let total = 0;
                for (let kandidat of daftarKandidat) {
                    total += kandidat.suara;
                }
                setTotal(total);
            }).catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Grow in={true} style={{ transformOrigin: '50% 0' }}>
            <Card>
                <CardHeader title="Suara keseluruhan" sx={{ p: 3, pb: 0 }} />
                <CardContent sx={{ px: 3 }}>
                    <RadialChart
                        data={daftarkandidat.map(kandidat => {
                            return {
                                angle: kandidat.suara,
                                label: '0' + kandidat.nomor + ' ' + kandidat.mahasiswa.nama + ' (' + kandidat.suara + ')',
                                color: colors[kandidat.warna][500],
                                
                            }
                        })}
                        width={256}
                        height={256}
                        showLabels={true}
                        colorType="literal" />
                    {daftarkandidat.map(kandidat => 
                        <p key={kandidat.nomor}>0{kandidat.nomor} {kandidat.mahasiswa.nama}: {(kandidat.suara / total * 100).toFixed(2).replace('.', ',')}% ({kandidat.suara})</p>
                    )}
                    <p>Total: {total}</p>
                </CardContent>
            </Card>
        </Grow>
    );
}
