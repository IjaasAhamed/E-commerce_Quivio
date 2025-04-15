import smartWatch from '../assets/smartwatch.png';
import drone from '../assets/drone.png';
import console from '../assets/console.png';
import smartPhone from '../assets/iphone.png';
import tv from '../assets/smart-tv.png';
import headPhone from '../assets/headphone.png';
import tws from '../assets/tws.png';
import camera from '../assets/camera.png';
import router from '../assets/wifi-router.png';
import laptop from '../assets/laptop.png';
import vr from '../assets/vr.png';
import sneaker from '../assets/sneaker.png';
import handbag from '../assets/handbag.png';
import cosmetic from '../assets/cosmetic.png';

export const electronicsCategories = [
  { name: "Smart Watch", image: smartWatch },
  { name: "Drone", image: drone },
  { name: "Game Console", image: console },
  { name: "Smart Phone", image: smartPhone },
  { name: "Smart TV", image: tv },
  { name: "Headphone", image: headPhone },
  { name: "Camera", image: camera },
  { name: "Router", image: router },
  { name: "Laptop", image: laptop },
  { name: "VR", image: vr },
  { name: "TWS", image: tws },
];

export const fashionCategories = [
  { name: "Sneakers", image: sneaker },
  { name: "Handbags", image: handbag },
  { name: "Skincare", image: cosmetic },
];

export const allCategoryNames = [
  ...electronicsCategories.map(cat => cat.name),
  ...fashionCategories.map(cat => cat.name),
];