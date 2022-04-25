import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonText, IonGrid, IonRow, IonCol, IonInput } from '@ionic/react';
import './Home.css';
import { gameResult } from '../App';
import prettyMs from "pretty-ms";
import { useState } from 'react';

interface HomeProps {
  gameResults: gameResult[];
  previousPlayers: string[];
  emailAddress: string;
  updateEmailAddress: (e: string) => void;
}

const calculateShortestGame = (r: gameResult[]) => (
  Math.min(
      ...r.map(x => Date.parse(x.end) - Date.parse(x.start))
  )
);

const calculateLeaderBoard = (p: string[], r: gameResult[]) => {

  const lb = p.map(x => {

    const gamesThisPlayerHasPlayed = r.filter(y => y.players.some(z => z.name === x));
    const gamesThisPlayerHasWon = gamesThisPlayerHasPlayed.filter(y => y.winner === x);

    return {
      name: x
      , wins: gamesThisPlayerHasWon.length
      , losses: gamesThisPlayerHasPlayed.length - gamesThisPlayerHasWon.length
      , winningPercentage: (gamesThisPlayerHasWon.length / gamesThisPlayerHasPlayed.length).toFixed(3)
    };
  });

  console.log("calculateLeaderBoard", lb);

  return lb;
};

const Home: React.FC<HomeProps> = ({
  gameResults
  , previousPlayers
  , emailAddress
  , updateEmailAddress
}) => {

  const [emailAddressForEditing, setEmailAddressForEditing] = useState(emailAddress);

  const lb = calculateLeaderBoard(previousPlayers, gameResults);

  const shortestGame = calculateShortestGame(gameResults);
  const shortestGameDisplay = isFinite(shortestGame) ? prettyMs(shortestGame) : "N/A";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        {
          emailAddress.length > 0 ? <>
          
            <h3>
              {emailAddress}
              <IonButton
                onClick={() => updateEmailAddress("")}
              >
                Reset
              </IonButton>
            </h3>
            <h3>
              Total Games Played: {gameResults.length}
            </h3>
            <h3>
              Shortest Game: {shortestGameDisplay}
            </h3>
            <IonGrid>
              {calculateLeaderBoard(previousPlayers, gameResults)
                .sort((a, b) => b.winningPercentage.localeCompare(a.winningPercentage))
                .map(x => (
                  <IonRow>
                    <IonCol>
                      {x.wins}
                    </IonCol>
                    <IonCol>
                      {x.losses}
                    </IonCol>
                    <IonCol>
                      {x.winningPercentage}
                    </IonCol>
                    <IonCol>
                      {x.name}
                    </IonCol>
                  </IonRow>
              ))}
            </IonGrid>
            <IonButton
              routerLink='/setup'
            >
              Play
            </IonButton>
          </> : <>
          
            <IonInput
              placeholder='Enter your email address'
              value={emailAddressForEditing}
              onIonChange={(e) => setEmailAddressForEditing(e.detail.value ?? "")}
            ></IonInput>
            <IonButton
              onClick={() => updateEmailAddress(emailAddressForEditing)}
            >
              Save
            </IonButton>
          </>
        }

      </IonContent>
    </IonPage>
  );
};

export default Home;
