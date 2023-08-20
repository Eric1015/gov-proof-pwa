import { Grid, Typography } from '@mui/material';
import Image from 'next/image';

type Props = {
  firstName: string;
  lastName: string;
  address: string;
  dateOfBirth: string;
  isAdult: boolean;
  imageUrl: string;
};

function InformationRow({ label, value }: { label: string; value: string }) {
  return (
    <Grid container item spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Typography variant="body1" component="div">
          {label}:{' '}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6" component="div">
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
}

function UserInformation({
  firstName,
  lastName,
  address,
  dateOfBirth,
  isAdult,
  imageUrl,
}: Props) {
  return (
    <>
      <Grid container spacing={1}>
        <InformationRow label="First Name" value={firstName} />
        <InformationRow label="Last Name" value={lastName} />
        <InformationRow label="Address" value={address} />
        <InformationRow label="Date of Birth" value={dateOfBirth} />
        <InformationRow label="Is Adult" value={isAdult ? 'Yes' : 'No'} />
        <Grid container item alignItems="center" spacing={2}>
          <Grid xs={4} item>
            <Typography variant="body1" component="div">
              Profile Image:
            </Typography>
          </Grid>
          <Grid item>
            <Image
              src={imageUrl}
              alt="profile image"
              height={150}
              width={150}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default UserInformation;
