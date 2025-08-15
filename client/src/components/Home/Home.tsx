import Banners from '../Banner/Banner';
import Highlights from '../Highlights/Highlights';
import Styles from "./Home.module.css";

const Home: React.FC = () =>
{
  return (
    <div className={Styles.homeContainer}>

      <Banners />

      <Highlights />
    
    </div>
  );
};

export default Home;