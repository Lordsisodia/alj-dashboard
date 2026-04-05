/**
 * Portfolio Domain - Client Data Exports
 */

import { PortfolioClient } from '../../types';

// Import all client data
import { uberCrypt } from './uber-crypt';
import { nmConstruction } from './nm-construction';
import { letsGo } from './lets-go';
import { sisoInternal } from './siso-internal';
import { mooshin } from './mooshin';
import { gritness } from './gritness';
import { trojanMma } from './trojan-mma';
import { fiveStarHire } from './five-star-hire';
import { elementary } from './elementary';
import { teamApollo } from './team-apollo';
import { luminelle } from './luminelle';
import { bikeRental } from './bike-rental';
import { carpetCleaner } from './carpet-cleaner';
import { dracoRestaurant } from './draco-restaurant';
import { deltaSports } from './delta-sports';
import { bdbtColdShower } from './bdbt-cold-shower';

// Export all clients in an array
export const allClients: PortfolioClient[] = [
  sisoInternal,
  teamApollo,
  letsGo,
  uberCrypt,
  mooshin,
  trojanMma,
  gritness,
  fiveStarHire,
  nmConstruction,
  luminelle,
  bikeRental,
  carpetCleaner,
  dracoRestaurant,
  deltaSports,
  bdbtColdShower,
  elementary,
];

// Named exports for direct access
export {
  sisoInternal,
  teamApollo,
  letsGo,
  uberCrypt,
  mooshin,
  trojanMma,
  gritness,
  fiveStarHire,
  nmConstruction,
  luminelle,
  bikeRental,
  carpetCleaner,
  dracoRestaurant,
  deltaSports,
  bdbtColdShower,
  elementary,
};
