---------NOTES----------

Spring Boot annotations:

@RestController - 
@RequestBody -
@RequestMapping - 
@GetMapping -
@PostMapping - 
@CrossOrigin - 
@Component - 

@Entity
@Id
@GeneratedValue
@Table
@Column
@JoinColumn
@ManyToOne

@Configuration
@Bean

@Service
@Value
@SuppressWarning

Errors:

409 - 
401 - 


Spring Security Pipeline:

Client sends HTTP request
          ↓
JwtAuthFilter
    • Read Authorization header
    • Validate JWT
    • If valid, set authenticated user
          ↓
Other Spring Security filters
          ↓
SecurityConfig authorization rules
    • Is this endpoint public?
    • Does it require authentication?
          ↓
Controller (@RestController)
          ↓
HTTP response sent back to client