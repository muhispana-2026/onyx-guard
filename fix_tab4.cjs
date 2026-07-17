const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const str = `                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* TAB 5: HACKER DUMPS */}`;

const rep = `                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HACKER DUMPS */}`;

code = code.replace(str, rep);
fs.writeFileSync('src/App.tsx', code);
