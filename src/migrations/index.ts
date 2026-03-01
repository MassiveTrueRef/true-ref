import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260228_070114 from './20260228_070114';
import * as migration_20260301_062904_comments_collection from './20260301_062904_comments_collection';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260228_070114.up,
    down: migration_20260228_070114.down,
    name: '20260228_070114',
  },
  {
    up: migration_20260301_062904_comments_collection.up,
    down: migration_20260301_062904_comments_collection.down,
    name: '20260301_062904_comments_collection'
  },
];
