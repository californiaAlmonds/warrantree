package com.warrantree.config;

import com.warrantree.entity.*;
import com.warrantree.repository.CategoryRepository;
import com.warrantree.repository.UserRepository;
import com.warrantree.repository.VaultRepository;
import com.warrantree.repository.ItemRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final VaultRepository vaultRepository;
    private final ItemRepository itemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CategoryRepository categoryRepository, 
                          UserRepository userRepository,
                          VaultRepository vaultRepository, 
                          ItemRepository itemRepository,
                          PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.vaultRepository = vaultRepository;
        this.itemRepository = itemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Initializing database with sample data...");
        
        // Initialize categories
        initializeCategories();
        
        // Initialize demo user and data
        initializeDemoData();
        
        log.info("Database initialization completed.");
    }

    private void initializeCategories() {
        if (categoryRepository.count() == 0) {
            log.info("Creating default categories...");
            
            List<Category> categories = List.of(
                Category.builder()
                    .name(Category.ELECTRONICS)
                    .description("Electronic devices and gadgets")
                    .icon("computer-desktop")
                    .reminderDaysDefault(30)
                    .build(),
                Category.builder()
                    .name(Category.APPLIANCES)
                    .description("Home and kitchen appliances")
                    .icon("home")
                    .reminderDaysDefault(60)
                    .build(),
                Category.builder()
                    .name(Category.INSURANCE)
                    .description("Insurance policies and coverage")
                    .icon("shield-check")
                    .reminderDaysDefault(90)
                    .build(),
                Category.builder()
                    .name(Category.DOCUMENTS)
                    .description("Important documents and certificates")
                    .icon("document-text")
                    .reminderDaysDefault(30)
                    .build(),
                Category.builder()
                    .name(Category.VEHICLES)
                    .description("Cars, motorcycles, and other vehicles")
                    .icon("truck")
                    .reminderDaysDefault(30)
                    .build(),
                Category.builder()
                    .name(Category.HOME_GARDEN)
                    .description("Home improvement and garden tools")
                    .icon("wrench-screwdriver")
                    .reminderDaysDefault(60)
                    .build(),
                Category.builder()
                    .name(Category.HEALTH_BEAUTY)
                    .description("Health and beauty products")
                    .icon("heart")
                    .reminderDaysDefault(30)
                    .build(),
                Category.builder()
                    .name(Category.OTHER)
                    .description("Other items")
                    .icon("squares-plus")
                    .reminderDaysDefault(30)
                    .build()
            );
            
            categoryRepository.saveAll(categories);
            log.info("Created {} categories", categories.size());
        }
    }

    private void initializeDemoData() {
        // Create demo user if it doesn't exist
        User demoUser = userRepository.findByEmail("demo@warrantree.com")
            .orElseGet(() -> {
                log.info("Creating demo user...");
                User user = User.builder()
                    .email("demo@warrantree.com")
                    .name("Demo User")
                    .password(passwordEncoder.encode("password123"))
                    .emailVerified(true)
                    .role(User.Role.USER)
                    .build();
                return userRepository.save(user);
            });

        // Create demo vault if user has no vaults
        if (vaultRepository.findByOwner(demoUser).isEmpty()) {
            log.info("Creating demo vault and items...");
            
            Vault demoVault = Vault.builder()
                .name("My Family Vault")
                .description("Our family's warranty and document collection")
                .owner(demoUser)
                .build();

            // Add owner as a member
            VaultMember ownerMember = VaultMember.builder()
                .vault(demoVault)
                .user(demoUser)
                .role(VaultMember.Role.OWNER)
                .build();
            
            demoVault.addMember(ownerMember);
            demoVault = vaultRepository.save(demoVault);

            // Create sample items
            createSampleItems(demoVault);
            
            log.info("Created demo vault with sample items");
        }
    }

    private void createSampleItems(Vault vault) {
        Category electronics = categoryRepository.findByName(Category.ELECTRONICS).orElse(null);
        Category appliances = categoryRepository.findByName(Category.APPLIANCES).orElse(null);
        Category insurance = categoryRepository.findByName(Category.INSURANCE).orElse(null);

        List<Item> sampleItems = List.of(
            Item.builder()
                .title("MacBook Pro 2023")
                .vault(vault)
                .category(electronics)
                .brand("Apple")
                .model("MacBook Pro 14-inch")
                .serialNumber("C02XL1234567")
                .purchaseDate(LocalDate.now().minusMonths(6))
                .price(new BigDecimal("1999.99"))
                .warrantyMonths(12)
                .notes("Purchased from Apple Store with extended AppleCare")
                .status(Item.Status.ACTIVE)
                .build(),
                
            Item.builder()
                .title("Samsung Refrigerator")
                .vault(vault)
                .category(appliances)
                .brand("Samsung")
                .model("RF28T5001SR")
                .serialNumber("SARL123456789")
                .purchaseDate(LocalDate.now().minusMonths(18))
                .price(new BigDecimal("1299.99"))
                .warrantyMonths(24)
                .notes("Energy Star certified, French door style")
                .status(Item.Status.ACTIVE)
                .build(),
                
            Item.builder()
                .title("Home Insurance Policy")
                .vault(vault)
                .category(insurance)
                .brand("State Farm")
                .model("Homeowners Policy")
                .serialNumber("HO-12345678")
                .purchaseDate(LocalDate.now().minusMonths(3))
                .price(new BigDecimal("1200.00"))
                .warrantyMonths(12)
                .notes("Annual renewal, includes flood coverage")
                .status(Item.Status.ACTIVE)
                .build(),
                
            Item.builder()
                .title("iPhone 14 Pro")
                .vault(vault)
                .category(electronics)
                .brand("Apple")
                .model("iPhone 14 Pro")
                .serialNumber("G6KQ12345678")
                .purchaseDate(LocalDate.now().minusWeeks(2))
                .price(new BigDecimal("999.99"))
                .warrantyMonths(12)
                .notes("Deep Purple color, 256GB storage")
                .status(Item.Status.ACTIVE)
                .build(),
                
            Item.builder()
                .title("Dyson Vacuum Cleaner")
                .vault(vault)
                .category(appliances)
                .brand("Dyson")
                .model("V15 Detect")
                .serialNumber("DY-987654321")
                .purchaseDate(LocalDate.now().minusDays(10))
                .price(new BigDecimal("599.99"))
                .warrantyMonths(24)
                .notes("Cordless, laser dust detection")
                .status(Item.Status.ACTIVE)
                .build()
        );

        itemRepository.saveAll(sampleItems);
    }
} 