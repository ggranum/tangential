const adjectives: string[] = [
  'Abrupt', 'Acidic', 'Adorable', 'Adventurous', 'Aggressive', 'Agitated', 'Alert', 'Aloof', 'Amiable', 'Amused',
  'Annoyed', 'Antsy', 'Anxious', 'Appalling', 'Appetizing', 'Apprehensive', 'Arrogant', 'Astonishing', 'Attractive',
  'Batty', 'Beefy', 'Bewildered', 'Biting', 'Bitter', 'Bland', 'Blushing', 'Bored', 'Brave', 'Bright', 'Broad', 'Bulky',
  'Burly', 'Charming', 'Cheeky', 'Cheerful', 'Clean', 'Clear', 'Cloudy', 'Clueless', 'Clumsy', 'Colorful', 'Colossal',
  'Combative', 'Comfortable', 'Confused', 'Contemplative', 'Convincing', 'Convoluted', 'Cooperative', 'Corny', 'Costly',
  'Courageous', 'Crabby', 'Creepy', 'Crooked', 'Cumbersome', 'Cynical', 'Dangerous', 'Dashing', 'Deep', 'Defeated',
  'Defiant', 'Delicious', 'Delightful', 'Depraved', 'Despicable', 'Determined', 'Dilapidated', 'Diminutive',
  'Disgusted', 'Distinct', 'Distraught', 'Distressed', 'Disturbed', 'Dizzy', 'Drab', 'Drained', 'Dull', 'Eager',
  'Ecstatic', 'Elated', 'Elegant', 'Embarrassed', 'Enchanting', 'Encouraging', 'Energetic', 'Enormous', 'Enthusiastic',
  'Envious', 'Exasperated', 'Excited', 'Exhilarated', 'Extensive', 'Exuberant', 'Fancy', 'Fantastic', 'Fierce',
  'Filthy', 'Flat', 'Floppy', 'Fluttering', 'Foolish', 'Frantic', 'Fresh', 'Friendly', 'Frothy', 'Frustrating', 'Funny',
  'Fuzzy', 'Gaudy', 'Gentle', 'Giddy', 'Gigantic', 'Glamorous', 'Gleaming', 'Glorious', 'Gorgeous', 'Graceful',
  'Gritty', 'Grubby', 'Grumpy', 'Handsome', 'Happy', 'Harebrained', 'Healthy', 'Helpful', 'Hollow', 'Homely', 'Huge',
  'Icy', 'Ideal', 'Immense', 'Impressionable', 'Intrigued', 'Itchy', 'Jealous', 'Jittery', 'Jolly', 'Joyous', 'Juicy',
  'Jumpy', 'Kind', 'Lackadaisical', 'Lazy', 'Little', 'Lively', 'Livid', 'Lonely', 'Loose', 'Lovely', 'Lucky',
  'Ludicrous', 'Macho', 'Magnificent', 'Mammoth', 'Maniacal', 'Massive', 'Melancholy', 'Melted', 'Miniature', 'Minute',
  'Mistaken', 'Misty', 'Moody', 'Muddy', 'Mysterious', 'Narrow', 'Naughty', 'Nervous', 'Nonchalant', 'Nonsensical',
  'Nutritious', 'Nutty', 'Oblivious', 'Obnoxious', 'Odd', 'Old-fashioned', 'Outrageous', 'Perfect', 'Perplexed',
  'Petite', 'Petty', 'Plain', 'Pleasant', 'Poised', 'Pompous', 'Precious', 'Prickly', 'Proud', 'Pungent', 'Puny',
  'Quaint', 'Quizzical', 'Ratty', 'Reassured', 'Relieved', 'Responsive', 'Ripe', 'Robust', 'Rough', 'Round', 'Salty',
  'Sarcastic', 'Scant', 'Scary', 'Scattered', 'Scrawny', 'Selfish', 'Shaggy', 'Shaky', 'Shallow', 'Sharp', 'Shiny',
  'Short', 'Silky', 'Silly', 'Skinny', 'Slippery', 'Small', 'Smarmy', 'Smiling', 'Smoggy', 'Smooth', 'Smug', 'Soggy',
  'Solid', 'Sore', 'Sour', 'Sparkling', 'Spicy', 'Splendid', 'Spotless', 'Square', 'Stale', 'Steady', 'Steep', 'Sticky',
  'Stormy', 'Stout', 'Strange', 'Strong', 'Stunning', 'Substantial', 'Successful', 'Succulent', 'Superficial',
  'Superior', 'Swanky', 'Sweet', 'Tart', 'Tasty', 'Teeny', 'Tender', 'Tense', 'Terrible', 'Testy', 'Thankful', 'Thick',
  'Thoughtful', 'Thoughtless', 'Timely', 'Tricky', 'Trite', 'Pated', 'Uneven', 'Unsightly', 'Upset', 'Uptight', 'Vast',
  'Vexed', 'Victorious', 'Virtuous', 'Vivacious', 'Vivid', 'Wacky', 'Whimsical', 'Whopping', 'Wicked', 'Witty',
  'Wobbly', 'Wonderful', 'Worried', 'Yummy', 'Zany', 'Zealous', 'Zippy'];


const nouns: string[] = [
  'Aardvark', 'Aardwolf', 'Albatross', 'Alligator', 'Alpaca', 'Anaconda', 'Anglerfish', 'Ant', 'Anteater', 'Antelope',
  'Antlion', 'Ape', 'Aphid', 'Armadillo', 'Asp', 'Baboon', 'Badger', 'Bandicoot', 'Barnacle', 'Barracuda', 'Basilisk',
  'Bass', 'Bat', 'Bear', 'Beaver', 'Bedbug', 'Bee', 'Beetle', 'Bison', 'Blackbird', 'Boa', 'Bobcat', 'Bobolink',
  'Bonobo', 'Booby', 'Bovid', 'Buffalo', 'Bug', 'Butterfly', 'Buzzard', 'Camel', 'Canid', 'Capybara', 'Cardinal',
  'Caribou', 'Carp', 'Caterpillar', 'Catfish', 'Catshark', 'Centipede', 'Cephalopod', 'Chameleon', 'Cheetah',
  'Chickadee', 'Chimpanzee', 'Chinchilla', 'Chipmunk', 'Cicada', 'Clam', 'Clownfish', 'Cobra', 'Cockroach', 'Cod',
  'Condor', 'Constrictor', 'Coral', 'Cougar', 'Cow', 'Coyote', 'Coypu', 'Crab', 'Crane', 'Crawdad', 'Crayfish',
  'Cricket', 'Crocodile', 'Crow', 'Cuckoo', 'Damselfly', 'Deer', 'Dingo', 'Dolphin', 'Dormouse', 'Dove', 'Dragon',
  'Dragonfly', 'Eagle', 'Earthworm', 'Earwig', 'Echidna', 'Eel', 'Egret', 'Elephant', 'Elk', 'Emu', 'Ermine', 'Falcon',
  'Ferret', 'Finch', 'Firefly', 'Fish', 'Flamingo', 'Flea', 'Fly', 'Flyingfish', 'Fowl', 'Fox', 'Fox', 'Frog',
  'Gazelle', 'Gecko', 'Gerbil', 'Gibbon', 'Giraffe', 'Goldfish', 'Gopher', 'Gorilla', 'Grasshopper', 'Grouse',
  'Guanaco', 'Gull', 'Guppy', 'Haddock', 'Halibut', 'Hamster', 'Hare', 'Harrier', 'Hawk', 'Hedgehog', 'Heron',
  'Herring', 'Hippopotamus', 'Hookworm', 'Hornet', 'Hoverfly', 'Hummingbird', 'Hyena', 'Iguana', 'Impala', 'Insect',
  'Jacana', 'Jackal', 'Jaguar', 'Jay', 'Jellyfish', 'Junglefowl', 'Kangaroo', 'Kingfisher', 'Kite', 'Kiwi', 'Koala',
  'Koi', 'Krill', 'Ladybug', 'Lamprey', 'Landfowl', 'Lark', 'Leech', 'Lemming', 'Lemur', 'Leopard', 'Leopard',
  'Leopard', 'Leopon', 'Limpet', 'Lion', 'Lizard', 'Llama', 'Lobster', 'Locust', 'Loon', 'Louse', 'Lungfish', 'Lynx',
  'Macaw', 'Mackerel', 'Magpie', 'Mammal', 'Manatee', 'Mandrill', 'Marlin', 'Marmoset', 'Marmot', 'Marsupial', 'Marten',
  'Mastodon', 'Meadowlark', 'Meerkat', 'Mink', 'Minnow', 'Mite', 'Mockingbird', 'Mole', 'Mollusk', 'Mongoose', 'Monkey',
  'Moose', 'Mosquito', 'Moth', 'Mouse', 'Mule', 'Muskox', 'Narwhal', 'Needlefish', 'Newt', 'Nighthawk', 'Nightingale',
  'Numbat', 'Ocelot', 'Octopus', 'Okapi', 'Olingo', 'Opossum', 'Orangutan', 'Orca', 'Oribi', 'Ostrich', 'Otter', 'Owl',
  'Ox', 'Panda', 'Panther', 'Panther', 'Parakeet', 'Parrot', 'Parrotfish', 'Partridge', 'Peacock', 'Peafowl', 'Pelican',
  'Penguin', 'Perch', 'Pheasant', 'Pig', 'Pike', 'Pinniped', 'Piranha', 'Planarian', 'Platypus', 'Pony', 'Porcupine',
  'Porpoise', 'Possum', 'Prawn', 'Primate', 'Ptarmigan', 'Puffin', 'Puma', 'Python', 'Quail', 'Quelea', 'Quokka',
  'Raccoon', 'Rat', 'Rattlesnake', 'Raven', 'Reindeer', 'Reptile', 'Rhinoceros', 'Roadrunner', 'Rodent', 'Rook',
  'Rooster', 'Roundworm', 'Sailfish', 'Salamander', 'Salmon', 'Sawfish', 'Scallop', 'Scorpion', 'Seahorse', 'Shrew',
  'Shrimp', 'Silkworm', 'Silverfish', 'Skink', 'Skunk', 'Sloth', 'Slug', 'Smelt', 'Snail', 'Snipe', 'Sole', 'Sparrow',
  'Spider', 'Spoonbill', 'Squid', 'Squirrel', 'Starfish', 'Stingray', 'Stoat', 'Stork', 'Sturgeon', 'Swallow', 'Swan',
  'Swift', 'Swordfish', 'Swordtail', 'Tahr', 'Takin', 'Tapir', 'Tarantula', 'Tarsier', 'Termite', 'Tern', 'Thrush',
  'Tick', 'Tiger', 'Tiglon', 'Titi', 'Toad', 'Tortoise', 'Toucan', 'Trout', 'Tuna', 'Turtle', 'Tyrannosaurus', 'Urial',
  'Vaquita', 'Vicuña', 'Viper', 'Voalavoanala', 'Vole', 'Vulture', 'Wallaby', 'Walrus', 'Warbler', 'Wasp', 'Waterbuck',
  'Weasel', 'Whale', 'Whippet', 'Whitefish', 'Wildcat', 'Wildebeest', 'Wildfowl', 'Wolf', 'Wolf', 'Wolverine', 'Wombat',
  'Woodchuck', 'Woodpecker', 'Worm', 'Wren', 'Xerinae', 'Yak', 'Zebra', 'Zebu', 'Zorilla',
]


export class NameGenerator {
  static adjectivesLength = adjectives.length
  static nounsLength = nouns.length

  static generate() {
    const aRand = Math.floor(NameGenerator.adjectivesLength * Math.random())
    const nRand = Math.floor(NameGenerator.nounsLength * Math.random())

    return adjectives[aRand] + ' ' + nouns[nRand]
  }
}
