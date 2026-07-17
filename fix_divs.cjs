const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const str = `                    </button>
                  </div>
                </div>
                {/* Event Logs list */}`;

const rep = `                    </button>
                  </div>
                  </div>
                </div>
                {/* Event Logs list */}`;

code = code.replace(str, rep);
fs.writeFileSync('src/App.tsx', code);
