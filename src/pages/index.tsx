import { Container, Grid, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import ModeSelectCard from '@/app/components/ModeSelectCard';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="md">
          <Grid container justifyContent="center">
            <Grid item xs={5}>
              <ModeSelectCard
                title="User"
                description="verify yourself with the government attested data"
                image="/icons/user.png"
                onClick={() => router.push('/users')}
              />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={5}>
              <ModeSelectCard
                title="Shop Owner"
                description="verify your customers meeting the requirements"
                image="/icons/store.png"
                onClick={() => router.push('/shops')}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </main>
  );
}
